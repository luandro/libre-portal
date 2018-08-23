#!/bin/sh
clear
op=1
mv db.csv db2.csv
scp root@thisnode.info:/etc/nodogsplash/vale/db.csv ./
while [ ! $op -eq 6 ]; do
  clear
  echo "--------------------------------------------------------------------------------"
  echo "|----------------------------Digite a opção desejada:--------------------------|"
  echo "|                                                                              |"
  echo "|1- Listar todos os vouchers cadastrados.                                      |"
  echo "|2- Cadastrar voucher para novo usuario.                                       |"
  echo "|3- Consultar prazo de validade do voucher.                                    |"
  echo "|4- Remover usuario/voucher.                                                   |"
  echo "|5- Editar usuario/voucher.                                                    |"
  echo "|6- Sair.                                                                      |"
  echo "|                                                                              |"
  echo "--------------------------------------------------------------------------------"
  read op
  case $op in

    1) clear

    echo Temos `cat db.csv | wc -l` vouchers cadastrados:
    echo ""
    sort -o db.csv db.csv
    cat db.csv

      echo "Aperte ENTER para continuar..."
      read
      ;;

    2) clear
    cont=1
      while [ ! $cont -eq 2 ]; do
      echo " ___________________________________________________ "
      echo "|                                                   |"
      echo "|                                                   |"
      echo "|    Para cadastrar um novo usuario digite          |"
      echo "|    um nome                                        |"
      echo "|                                                   |"
      echo "|___________________________________________________|"


      printf "Digite o nome do usuario: "
      echo ""
      read nome
        if [ ${#nome}=0 ]
        then
          voucher=$(date |md5 | head -c12)
          echo "$nome,$voucher,," >> db.csv
          sort -o db.csv db.csv
	        echo "Usuario $nome cadastrado com o voucher $voucher"
          echo ""
        else
        echo "Não deixe o nome em branco, isso atrapalha a vida!"
        echo ""
        fi
      cat db.csv
      printf "Deseja cadastrar usuario novamente?(s ou n)"
      read cont
        case $cont in
          S|s|sim|SIM|Y|yes|YES|y) cont=1
          ;;
          N|n|nao|Nao|NO|no) cont=2
         ;;
        *) echo "Opcao invalida"
          echo "Aperte ENTER para continuar..."
          read
        esac #fim do while 8
      done
    ;;
    3) clear
      consulta=1
      while [ ! $consulta -eq 2 ]; do
      hoje="$(date +%s)"
      vale_secs=2592000 #seconds = 30 days
      echo " ___________________________________________________ "
      echo "|                                                   |"
      echo "|                                                   |"
      echo "| Este opção vai te ajudar a consultar o prazo de   |"
      echo "| validade do voucher de user cadastrado.           |"
      echo "|___________________________________________________|"

      printf "Para consultar digite o nome do usuario cadastrado "
      read nome

        if [ ${#nome}=0 ]
        then
        cat db.csv |grep "$nome" | cut -f3 -d "," > usertemp
        cat db.csv |grep "$nome" | cut -f1 -d "," > user
          cat usertemp | while read temp
           do
           rest=$[(($temp-$hoje)+$vale_secs)/86400]
            if [ $rest -lt 0  ]
            then
            echo "O voucher associado a esse usuario ainda não foi utilizado"
            else
            echo faltam $rest dias para acabar o voucher do user $nome
            fi
           done
        else
        echo "Não deixe o nome em branco, isso atrapalha a vida!"
        fi
      printf "Deseja consultar prazo para usuario novamente?(s ou n)"
      read consulta
      case $consulta in
        S|s|sim|SIM|Y|yes|YES|y) consulta=1
          ;;
        N|n|nao|Nao|NO|no) consulta=2
         ;;
        *) echo "Opcao invalida"
          echo "Aperte ENTER para continuar..."
          read
      esac #fim do while 8
    done

   echo "Aperte ENTER para continuar..."
   read
   ;;

    4) clear # ???
    remval=1
    while [ ! $remval -eq 2 ]; do
    echo " ___________________________________________________ "
    echo "|                                                   |"
    echo "|                                                   |"
    echo "| Menu para REMOVER usuarios, para isso digite      |"
    echo "| exatamente o nome como no cadastro                |"
    echo "|                                                   |"
    echo "|___________________________________________________|"

    echo "-----------------------------------------------------"
    echo "Os usuarios cadastrados são:"
    cat user

    printf "Nome do user a remover: "
    read nome

    if [ ${#nome}=0 ]
    then

    grep -v "$nome" db.csv > /tmp/$$
    mv /tmp/$$ db.csv
    cat db.csv | cut -f1 -d "," > user

    echo "Nome removido com sucesso, até mais!"

    else
    echo "Não deixe o nome em branco, isso atrapalha a vida!"
    fi
    printf "Deseja remover mais usuarios?(s ou n)"
      read remval
      case $remval in
        S|s|sim|SIM|Y|yes|YES|y) remval=1
          ;;
        N|n|nao|Nao|NO|no) remval=2
         ;;
        *) echo "Opcao invalida"
          echo "Aperte ENTER para continuar..."
          read
      esac #fim do while 8
    done

     echo "Aperte ENTER para continuar..."
     read
     ;;

    5) clear # ???
    remval=1
    while [ ! $remval -eq 2 ]; do

    echo " ___________________________________________________ "
    echo "|                                                   |"
    echo "|                                                   |"
    echo "| Programa para editar usuarios, para isso digite   |"
    echo "| o nome como no cadastro, e depois um voucher      |"
    echo "|                                                   |"
    echo "|___________________________________________________|"

    printf "Nome do user para editar: "
    read nome

      if [ ${#nome}=0 ]
      then
      grep -v "$nome" db.csv > /tmp/$$
      mv /tmp/$$ db.csv
      voucher=$(date |md5 | head -c12)
      echo "$nome,$voucher,," >> db.csv
      sort -o db.csv db.csv
      else
      echo "Não deixe o nome em branco, isso atrapalha a vida!"
      fi
    printf "Deseja editar mais usuarios?(s ou n)"
      read remval
      case $remval in
        S|s|sim|SIM|Y|yes|YES|y) remval=1
          ;;
        N|n|nao|Nao|NO|no) remval=2
         ;;
        *) echo "Opcao invalida"
          echo "Aperte ENTER para continuar..."
          read
      esac #fim do while 8
    done

    echo "Aperte ENTER para continuar..."
    read
    ;;

    6) clear
      echo "Deseja realmente sair?"
      read res
      case $res in
        S|s|sim|SIM|Y|yes|YES|y) op=6

          if diff db.csv db2.csv >/dev/null ; then
            echo "Nenhuma alteração foi encontrada"
          else

              printf "Deseja salvar as alterações no Gateway?: "
              read respb
              case $respb in
              S|s|sim|SIM|Y|yes|YES|y)
              scp ./db.csv root@thisnode.info:/etc/nodogsplash/vale/db.csv
              echo "Alterações realiadas com sucesso!"
              ;;
              N|n|nao|Nao|NO|no)
                echo "Ok, as alterações feitas na secção não foram implementadas Gataway"
                ;;
              *) echo "Opção invalida"
                echo "aperte ENTER para continuar"
              esac
          fi
          cat db.csv
              ;;
        N|n|nao|Nao|NO|no) op=0
          ;;
        *) echo "Opcao invalida"
          echo "Aperte ENTER para continuar..."
          read
      esac #fim do while 8
      ;;

    7|8|9|1[0-2]) clear
      echo "Opcao ainda nao implementada."
      echo "Aperte ENTER para continuar..."
      read
      ;;

    *) clear
      echo "Opcao invalida."
      echo "Aperte ENTER para continuar..."
      read
      ;;

    esac #fim do case

done #fim do while
